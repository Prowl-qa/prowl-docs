import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';
import DocFeedback from '@site/src/components/DocFeedback';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): React.ReactElement {
  return (
    <>
      <DocFeedback />
      <Footer {...props} />
    </>
  );
}
