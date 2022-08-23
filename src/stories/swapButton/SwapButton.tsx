import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import './swapButton.css';

interface SwapButtonProps {
    onClick: () => void;
}

export const SwapButton = ({
    onClick
}: SwapButtonProps) => {
    return (
        <div className="swap-button-outline" onClick={onClick}>
            <div className="swap-button">
                <FontAwesomeIcon icon={faExchangeAlt} className="w-clearfix swap-button-icon" />
            </div>
        </div>
    )
}
