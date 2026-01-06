export default function LocationChart() {
  const locations = [
    { name: "Office HQ", value: 65, color: "#157FED" },
    { name: "Remote", value: 20, color: "#2E7E33" },
    { name: "Branch A", value: 10, color: "#E97723" },
    { name: "Branch B", value: 5, color: "#686EA0" },
  ];

  const total = locations.reduce((sum, loc) => sum + loc.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--rawuh-text)]">
          Employee Locations
        </h3>
        <p className="text-sm text-[var(--rawuh-text-muted)]">
          Distribution by work location
        </p>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {locations.map((location, index) => {
              const percentage = (location.value / total) * 100;
              const circumference = 2 * Math.PI * 35;
              const strokeDasharray = `${
                (percentage / 100) * circumference
              } ${circumference}`;
              const strokeDashoffset = -(
                (cumulativePercentage / 100) *
                circumference
              );
              cumulativePercentage += percentage;

              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke={location.color}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[var(--rawuh-text)]">
              {total}
            </span>
            <span className="text-xs text-[var(--rawuh-text-muted)]">
              Total
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {locations.map((location) => (
          <div
            key={location.name}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: location.color }}
              />
              <span className="text-sm text-[var(--rawuh-text)]">
                {location.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--rawuh-text)]">
                {location.value}
              </span>
              <span className="text-xs text-[var(--rawuh-text-muted)]">
                ({Math.round((location.value / total) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
