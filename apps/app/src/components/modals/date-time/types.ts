export type DateSelectModalProps = {
  visible?: boolean;
  value?: Date;
  defaultValue?: Date;
  onChangeValue?: (selectedDate: Date | null) => void;
  onDismiss?: () => void;
  canSelectTime?: boolean;
};
