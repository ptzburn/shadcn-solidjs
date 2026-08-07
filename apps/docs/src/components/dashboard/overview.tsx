import { BarChart } from "~/registry/ui/charts.tsx";

export function Overview() {
  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sales",
        backgroundColor: "var(--primary)",
        borderRadius: 4,
        data: [
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
          Math.floor(Math.random() * 5000) + 1000,
        ],
      },
    ],
  };

  return (
    <div class="h-[350px] w-full">
      <BarChart
        data={chartData}
        options={{
          scales: {
            x: { ticks: { display: true } },
            y: {
              ticks: {
                display: true,
                callback: (value) => `$${value}`,
              },
            },
          },
        }}
      />
    </div>
  );
}
