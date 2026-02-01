type HomeProps = {
  readonly onStart: () => void;
  readonly onStartDebug: () => void;
};

export const Home = ({ onStart, onStartDebug }: HomeProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col gap-4 items-center">
        <button
          onClick={onStart}
          className="px-8 py-4 text-2xl font-bold text-white bg-prepare rounded-lg hover:bg-green-600 transition-colors"
        >
          Start
        </button>
        <button
          onClick={onStartDebug}
          className="px-8 py-4 text-2xl font-bold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Debug
        </button>
      </div>
    </div>
  );
};
