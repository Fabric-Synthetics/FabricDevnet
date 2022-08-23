import {
  LinearProgress,
  linearProgressClasses,
  Tooltip,
  tooltipClasses,
  TooltipProps
} from "@mui/material";
import ModalUnstyled from '@mui/base/ModalUnstyled';
import { styled } from '@mui/system';

export const BorderLinearProgress = styled(LinearProgress)(({ }) => ({
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: 'var(--primary)',
  },
}));

export const HtmlTooltip = styled(({ className, children, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow>
    {children}
  </Tooltip>
))(({ }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: 'rgba(33, 215, 229, 0.75)',
    backgroundColor: 'var(--translucent)',
    display: 'none',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--translucent)',
    maxWidth: 220,
    fontFamily: 'Work Sans',
    fontSize: 14,
    fontWeight: 500,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textAlign: 'left',
    border: 'solid 1px rgba(33, 215, 229, 0.75)',
    color: 'var(--primary-dim)',
  },
  [`& .${tooltipClasses.popper}`]: {
    zIndex: 1,
  }
}));

export const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  -webkit-tap-highlight-color: transparent;
`;

export const style = {
  width: '100%',
  maxWidth: '600px',
  padding: '24px 32px 28px',
  border: 'solid 1px rgba(33, 215, 229, 0.75)',
  borderRadius: '8px',
  backdropFilter: 'blur(30px)',
  boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
  backgroundColor: 'var(--translucent)',
  color: 'white',
  marginLeft: '8px',
  marginRight: '8px'
};

