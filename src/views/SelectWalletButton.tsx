import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletConnectButton, WalletIcon, WalletModalButton } from "@solana/wallet-adapter-react-ui";
import { Button, ButtonProps } from "@solana/wallet-adapter-react-ui/lib/Button";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import '@solana/wallet-adapter-react-ui/styles.css';

export const SelectWalletButton: FC<ButtonProps> = ({ children, ...props }) => {
    const { publicKey, wallet, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);
    const [active, setActive] = useState(false);
    const ref = useRef<HTMLUListElement>(null);

    const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const content = useMemo(() => {
        if (children) return children;
        if (!wallet || !base58) return null;
        return base58.slice(0, 6) + '...' + base58.slice(-6);
    }, [children, wallet, base58]);

    const copyAddress = useCallback(async () => {
        if (base58) {
            await navigator.clipboard.writeText(base58);
            setCopied(true);
            setTimeout(() => setCopied(false), 400);
        }
    }, [base58]);

    const openDropdown = useCallback(() => {
        setActive(true);
    }, []);

    const closeDropdown = useCallback(() => {
        setActive(false);
    }, []);

    const openModal = useCallback(() => {
        setVisible(true);
        closeDropdown();
    }, [closeDropdown]);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target as Node)) return;

            closeDropdown();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, closeDropdown]);

    const styles = {
        backgroundColor: 'hsl(199, 87%, 12%)', height: '2.5em', color: 'hsl(230, 4%, 70%)',
        minWidth: '100%',
    };
    const iconStyles = {
        ...{maxWidth: '0.85em', maxHeight: '0.85em'},
        flexShrink: '2',
    };
    const textStyles = {
        fontSize: 16, fontWeight: 600, fontFamily:"'Rajdhani', sans-serif",
    };
    const onlyTextButtonStyles = {
      color: styles.color, flexGrow: 2,...textStyles,
    };

    if (!wallet) return <WalletModalButton {...props} style={{...styles, ...textStyles, ...props.style}}>{children}</WalletModalButton>;
    if (!base58) return <WalletConnectButton {...props} style={{...styles, ...textStyles, ...props.style}}>{children}</WalletConnectButton>;

    return (
        <div className="wallet-adapter-dropdown" style={{width: '100%'}}>
            <Button
                aria-expanded={active}
                className="wallet-adapter-button-trigger"
                style={{ pointerEvents: active ? 'none' : 'auto', ...styles, ...props.style}}
                onClick={openDropdown}
                startIcon={<WalletIcon wallet={wallet} style={iconStyles}/>}
                {...props}
            >
                <p style={onlyTextButtonStyles}>{content}</p>
            </Button>
            <ul
                aria-label="dropdown-list"
                className={`wallet-adapter-dropdown-list ${active && 'wallet-adapter-dropdown-list-active'}`}
                ref={ref}
                role="menu"
            >
                <li onClick={copyAddress} className="wallet-adapter-dropdown-list-item" role="menuitem">
                    {copied ? 'Copied' : 'Copy address'}
                </li>
                <li onClick={openModal} className="wallet-adapter-dropdown-list-item" role="menuitem">
                    Change wallet
                </li>
                <li onClick={disconnect} className="wallet-adapter-dropdown-list-item" role="menuitem">
                    Disconnect
                </li>
            </ul>
        </div>
    );
};
export default SelectWalletButton;