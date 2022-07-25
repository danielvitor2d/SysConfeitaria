type TweetProps = {
  text: String;
};

export function Tweet({ text }: TweetProps) {
  return <p>{text}</p>;
}
