import placeHolderImg from "../assets/vinyl.webp";

type Props = {
  src?: string;
  title?: string;
  className?: string;
};

const CoverArt: React.FC<Props> = ({ src, title, className }) => {
  return (
    <img src={src || placeHolderImg} alt={`cover picture - ${title}`} className={className}></img>
  );
};

export default CoverArt;
