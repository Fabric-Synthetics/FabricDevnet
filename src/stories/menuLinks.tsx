import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import {
    Waves,
    Analytics,
    SwapHoriz,
    AddRoad,
    ListAlt,
    MenuBookRounded,
    ForumRounded,
    HowToVoteRounded,
    ChromeReaderModeRounded
} from '@mui/icons-material';

export const syntheticsMenuLinks = [
    {
        name: "Stake",
        icon: <VerticalAlignBottomIcon className="icon" />,
        link: "/#",
        external: false,
        disabled: false
    },
    {
        name: "Swap",
        icon: <SwapHoriz className="icon" />,
        link: "/#",
        external: false,
        disabled: false
    },
    {
        name: "Analytics",
        icon: <Analytics className="icon" />,
        link: "/#",
        external: false,
        disabled: true
    },
];

export const ecosystemMenuLinks = [
    {
        name: "LP Staking",
        icon: <Waves className="icon" />,
        link: "https://stake.fsynth.io",
        external: true,
        disabled: false
    },
    {
        name: "Swap to LP",
        icon: <SwapHoriz className="icon" />,
        link: "https://zap.fsynth.io",
        external: true,
        disabled: false
    },
    {
        name: "Roadmap",
        icon: <AddRoad className="icon" />,
        link: "https://fsynth.io/roadmap",
        external: true,
        disabled: false
    },
    {
        name: "DEX",
        icon: <ChromeReaderModeRounded className="icon" />,
        link: "https://dex.fsynth.io",
        external: true,
        disabled: false
    },
    {
        name: "Documentation",
        icon: <MenuBookRounded className="icon" />,
        link: "https://docs.fsynth.io",
        external: true,
        disabled: false
    },
    {
        name: "DAO Voting",
        icon: <HowToVoteRounded className="icon" />,
        link: "https://fsynth.io/dao",
        external: true,
        disabled: false
    },
    {
        name: "DAO Forum",
        icon: <ForumRounded className="icon" />,
        link: "/#",
        external: false,
        disabled: true
    }
];