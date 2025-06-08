import React from "react";

interface InfoRow {
  label: string;
  value: React.ReactNode; // can be string or JSX if needed
}

interface InfoBoxProps {
  title: string;
  rows: InfoRow[];
  buttonText: string;
  onButtonClick?: () => void;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, rows, buttonText, onButtonClick }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-8 text-gray-200 shadow-md w-full max-w-4xl lg:h-full flex flex-col justify-between">
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="mt-6 border-t border-white/10">
          <dl className="divide-y divide-white/10">
            {rows.map(({ label, value }, idx) => (
              <div
                key={idx}
                className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="text-sm font-medium text-white">{label}</dt>
                <dd className="mt-1 text-sm text-gray-400 sm:col-span-2 sm:mt-0">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <button
        type="button"
        onClick={onButtonClick}
        className="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default InfoBox;
