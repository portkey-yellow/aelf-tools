import { Row, Col } from 'antd';
import { useAsync } from 'react-use';
import { request } from 'api';
import CommonModal from 'components/CommonModal';
import { useLanguage } from 'i18n';
import CommonTable from 'components/CommonTable';
import CommonButton from 'components/CommonButton';
import { useHomeContext } from '../HomeContext';
import { setLimitAmountDescModal } from '../HomeContext/actions';
import { RateLimitItem } from './contants';
import { useReceiptColumns, useSwapColumns } from './columns';
import styles from './styles.module.less';

export default function LimitAmountDescModal() {
  const { t } = useLanguage();
  const [{ limitAmountDescModal }, { dispatch }] = useHomeContext();

  const swapColumns = useSwapColumns();
  const receiptColumns = useReceiptColumns();

  const dailyLimitData = useAsync(async () => {
    const res = await request.cross.getDailyLimits();
    if (res.error) {
      return [];
    }

    return res.items;
  });

  const rateLimitData = useAsync(async () => {
    const res = await request.cross.getRateLimits();
    if (res.error) {
      return [];
    }

    return res.items;
  });

  const closeModal = () => dispatch(setLimitAmountDescModal(false));

  return (
    <CommonModal
      title={t('eBridge limit rules title')}
      visible={limitAmountDescModal}
      onCancel={closeModal}
      className={styles['select-amount-desc-modal']}>
      <Row gutter={[0, 24]} className={styles['scroll-box']}>
        <Col span={24}>
          <Row gutter={[0, 16]}>
            <Col span={24} className={styles['item-title']}>
              {t('eBridge daily limit specification')}
            </Col>
            <Col span={24}>{t('eBridge daily limit specification desc')}</Col>
            <Col span={24}>
              <CommonTable
                columns={receiptColumns}
                dataSource={dailyLimitData.loading ? [] : dailyLimitData.value}
                pagination={{ hideOnSinglePage: true }}
                rowKey="token"
                loading={dailyLimitData.loading}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[0, 16]}>
            <Col span={24} className={styles['item-title']}>
              {t('eBridge rate limits')}
            </Col>
            <Col span={24}>
              <Row gutter={[0, 8]}>
                {Object.values(t('eBridge rate limits desc', { returnObjects: true })).map((ele: any, idx: number) => (
                  <Col span={24} key={idx} className={styles['item-text']}>
                    {ele}
                  </Col>
                ))}
              </Row>
            </Col>
            <Col span={24} className={styles['item-title']}>
              {t('Supported tokens')}
            </Col>
            <Col span={24}>
              <Row gutter={[0, 16]}>
                {rateLimitData?.value?.map((symoblItem: RateLimitItem) => (
                  <Col span={24} key={`${symoblItem.fromChain}_${symoblItem.toChain}`}>
                    <Row gutter={[0, 16]}>
                      <Col span={24} className={styles['item-text']}>
                        {`${symoblItem.fromChain} -> ${symoblItem.toChain}`}
                      </Col>
                      <Col span={24}>
                        <CommonTable
                          columns={swapColumns}
                          dataSource={symoblItem.receiptRateLimitsInfo}
                          pagination={{ hideOnSinglePage: true }}
                          rowKey="token"
                        />
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className={styles['confirm-btn-box']}>
        <CommonButton type="primary" className={styles['confirm-btn']} onClick={closeModal}>
          {t('OK')}
        </CommonButton>
      </div>
    </CommonModal>
  );
}
