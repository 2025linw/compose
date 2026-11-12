import Layout from '@components/layout';
import PasswordInput from '@components/password-input';
import TextInput from '@components/primitive/text-input';

export default function InputTypesDebug() {
  return (
    <Layout
      headerText="InputTypes"
      showBackButton
    >
      <TextInput />

      <PasswordInput />
    </Layout>
  );
}
