export default {
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    console.log("⏰ Cron job triggered at (UTC):", new Date().toISOString());

    // Convert Mbps to total bits for the specified period
    const bandwidthThreshold = parseInt(env.BANDWIDTH_THRESHOLD_BITS, 10) * 1000000 * 60 * parseInt(env.PERIOD, 10);
    const now = Date.now() - 60000; // Subtract 1-minute delay
    const datetime_geq = new Date(now - parseInt(env.PERIOD, 10) * 60000).toISOString(); // Start of the period
    const datetime_leq = new Date(now).toISOString(); // End of the period

    console.log(`📅 Query Time Range: ${datetime_geq} to ${datetime_leq}`);

    // GraphQL Query
    const query = `
      query {
        viewer {
          accounts(filter: {accountTag: "${env.ACCOUNT_ID}"}) {
            magicTransitNetworkAnalyticsAdaptiveGroups(
              filter: { datetime_geq: "${datetime_geq}", datetime_leq: "${datetime_leq}", outcome: "pass" }
              limit: 10
            ) {
              sum {
                bits
              }
            }
          }
        }
      }
    `;

    console.log("📜 GraphQL Query:", query);

    try {
      const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      console.log("🔍 Full API Response:", JSON.stringify(data, null, 2));

      // Extract bandwidth data
      const bitsUsed = data?.data?.viewer?.accounts?.[0]?.magicTransitNetworkAnalyticsAdaptiveGroups?.[0]?.sum?.bits ?? 0;
      const bandwidth = bitsUsed / (60 * parseInt(env.PERIOD, 10)) / 1000000;

      console.log(`📊 Current bandwidth: ${bandwidth} Mbps (Threshold: ${env.BANDWIDTH_THRESHOLD_BITS} Mbps)`);

      // Send alert if bandwidth exceeds threshold
      if (bitsUsed > bandwidthThreshold) {
        await fetch(env.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🚨 Bandwidth exceeded: ${bandwidth} Mbps (Threshold: ${env.BANDWIDTH_THRESHOLD_BITS} Mbps)`,
          }),
        });

        console.log("✅ Alert sent to webhook!");
      } else {
        console.log("✅ Bandwidth is within limits.");
      }
    } catch (error) {
      console.error("❌ Error fetching GraphQL data:", error);
    }
  },
};
