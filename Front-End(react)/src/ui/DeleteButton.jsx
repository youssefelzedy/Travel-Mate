import { HiArchiveBoxXMark } from "react-icons/hi2";

function DeleteButton({ onClick }) {
    return (
        <div className="delete-button-container">
            <button onClick={onClick} className="delete-button">
                <HiArchiveBoxXMark />
            </button>
        </div>
    );
}

export default DeleteButton;
