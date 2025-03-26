type Props = {
  heightRem: number;
  amountCards: number;
};

export function Loading({ heightRem, amountCards }: Props) {
  return (
    <>
      {Array.from({ length: amountCards }, (_, i) => i).map((_, i) => (
        <div
          key={i}
          className={`h-${heightRem} bg-gray-200 rounded animate-pulse`}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </>
  );
}
