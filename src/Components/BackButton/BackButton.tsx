import "./BackButton.css";
interface BackButtonProps {
  onClick: () => void;
}
const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <div className="styled-wrapper">
      <button className="button-back" onClick={onClick}>
        <div className="button-box-back">
          <span className="button-elem-back">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="arrow-icon"
            >
              <path
                fill="black"
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
              ></path>
            </svg>
          </span>
          <span className="button-elem-back">
            <svg
              fill="black"
              viewBox="0 0  24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="arrow-icon"
            >
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
            </svg>
          </span>
        </div>
      </button>
    </div>
  );
};

export default BackButton;
