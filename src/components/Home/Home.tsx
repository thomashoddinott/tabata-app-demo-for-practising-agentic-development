type HomeProps = {
  readonly onStart: () => void;
};

export const Home = ({ onStart }: HomeProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <button
        onClick={onStart}
        className="px-8 py-4 text-2xl font-bold text-white bg-prepare rounded-lg hover:bg-green-600 transition-colors"
      >
        Start
      </button>
    </div>
  );
};
