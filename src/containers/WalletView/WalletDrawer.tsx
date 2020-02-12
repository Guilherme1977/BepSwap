import React, { useState, useCallback } from 'react';
import { Icon, notification } from 'antd';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';

import Button from '../../components/uielements/button';
import Label from '../../components/uielements/label';
import WalletButton from '../../components/uielements/walletButton';

import { WalletDrawerWrapper, Drawer } from './WalletDrawer.style';

import * as walletActions from '../../redux/wallet/actions';
import { RootState } from '../../redux/store';
import { User } from '../../redux/wallet/types';
import { Maybe } from '../../types/bepswap';
import WalletView from './WalletView';

type Props = {
  user: Maybe<User>;
  forgetWallet: typeof walletActions.forgetWallet;
  refreshBalance: typeof walletActions.refreshBalance;
  refreshStake: typeof walletActions.refreshStake;
};

const WalletDrawer: React.FC<Props> = props => {
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const { user, refreshBalance, refreshStake } = props;
  const wallet = user ? user.wallet : null;

  const toggleDrawer = useCallback(() => {
    if (wallet && visible === false) {
      refreshBalance(wallet);
      refreshStake(wallet);
    }
    setVisible(!visible);
  }, [refreshBalance, refreshStake, visible, wallet]);

  const onClose = () => {
    setVisible(false);
  };

  const onCopyWallet = useCallback(() => {
    if (wallet) {
      copy(wallet);
      notification.open({
        message: 'Copy successful!',
      });
    }
  }, [wallet]);

  const onClickRefresh = useCallback(() => {
    if (wallet) {
      refreshBalance(wallet);
      refreshStake(wallet);
    }

    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  }, [refreshBalance, refreshStake, wallet]);

  const status = wallet ? 'connected' : 'disconnected';

  return (
    <WalletDrawerWrapper>
      <WalletButton
        data-test="wallet-draw-button"
        connected
        value={wallet}
        onClick={toggleDrawer}
      />
      <div className="wallet-mobile-btn" onClick={toggleDrawer}>
        <Icon type="wallet" />
      </div>
      <Drawer
        placement="right"
        closable={false}
        width={350}
        onClose={onClose}
        visible={visible}
      >
        <div className="refresh-balance-icon" onClick={onClickRefresh}>
          <Icon type="sync" spin={refresh} />
        </div>
        <WalletView status={status} />
        <div className="wallet-drawer-tools">
          <Button
            className="forget-btn"
            data-test="wallet-forget-button"
            typevalue="outline"
            color="primary"
            onClick={props.forgetWallet}
          >
            FORGET
          </Button>
        </div>
        {wallet && (
          <div className="wallet-address">
            <Label className="wallet-label-wrapper">{wallet}</Label>
            <div
              className="copy-btn-wrapper"
              onClick={wallet ? onCopyWallet : undefined}
            >
              COPY
            </div>
          </div>
        )}
      </Drawer>
    </WalletDrawerWrapper>
  );
};

export default connect(
  (state: RootState) => ({
    user: state.Wallet.user,
  }),
  {
    refreshBalance: walletActions.refreshBalance,
    refreshStake: walletActions.refreshStake,
    forgetWallet: walletActions.forgetWallet,
  },
)(WalletDrawer);