type ChipColorType = 'red' | 'gray' | 'blue' | 'orange' | 'green' | 'pink' | 'violet';

interface Props {
  text: string;
  rounded?: boolean;
  color?: ChipColorType;
}

const colorClass = {
  red: `text-red-600 bg-red-100`,
  gray: `text-gray-600 bg-gray-100`,
  blue: `text-blue-600 bg-blue-100`,
  orange: `text-orange-600 bg-orange-100`,
  green: `text-green-700 bg-green-100`,
  pink: `text-pink-600 bg-pink-100`,
  violet: `text-violet-600 bg-violet-100`,
};

export function Chip({ text, rounded = false, color = 'gray' }: Props) {
  return (
    <span
      className={`inline-block w-fit text-[0.8rem] px-[0.6rem] leading-6 font-bold
      ${rounded ? 'rounded-full' : 'rounded-[0.6rem]'}
      ${colorClass[color]}`}
    >
      {text}
    </span>
  );
}
