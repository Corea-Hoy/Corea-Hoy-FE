type Button = {
  image: string;
  text: string;
};

interface Props {
  buttons: Button[];
  activeIndex: number | null;
  onChange: (index: number) => void;
}

export function CategoryButtons({ buttons, activeIndex, onChange }: Props) {
  return (
    <>
      {buttons.map((item, i) => (
        <button
          key={i}
          className={`flex justify-center items-center flex-col gap-2 py-4.5 px-3.5 rounded-xl border-2 border-transparent cursor-pointer ${i === activeIndex ? '!border-green-500 bg-green-200/10' : 'bg-white'}`}
          onClick={() => onChange(i)}
        >
          <img className="w-[3.5rem]" src={item.image} alt="" />
          <span>{item.text}</span>
        </button>
      ))}
    </>
  );
}
