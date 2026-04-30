interface Props {
  total: number;
  currentStep: number;
}

export function Stepper({ total, currentStep }: Props) {
  return (
    <div className="flex gap-2 justify-center mb-12">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`inline-block w-[0.6rem] h-[0.6rem] rounded-full ${i === currentStep ? 'bg-green-700' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
}
