import { MessageKey } from '@/i18n/message-keys.g';
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';

export type SimpleMessageBoxAlertCategory = 'loading-failed' | 'action-failed';

export function useSimpleMessageBox() {
  const { t } = useI18n();

  const titleMessageKeyByAlertCategory: Map<SimpleMessageBoxAlertCategory, string> = new Map([
    ['loading-failed', MessageKey.loadingFailed],
    ['action-failed', MessageKey.actionFailed],
  ]);

  const showAlert = (category: SimpleMessageBoxAlertCategory, messageKey: MessageKey) => {
    const titleMessageKey = titleMessageKeyByAlertCategory.get(category);
    if (!titleMessageKey) throw Error(`Invalid category: ${category}`);

    ElMessageBox.alert(t(messageKey), t(titleMessageKey), {
      type: 'error',
      cancelButtonText: t(MessageKey.close),
      showCancelButton: true,
      showConfirmButton: false,
      closeOnPressEscape: true,
    }).catch(() => {});
  };

  return { showAlert };
}
