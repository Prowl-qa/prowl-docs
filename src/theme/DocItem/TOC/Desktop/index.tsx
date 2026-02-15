import React from 'react';
import TOCDesktop from '@theme-original/DocItem/TOC/Desktop';
import type TOCDesktopType from '@theme/DocItem/TOC/Desktop';
import type {WrapperProps} from '@docusaurus/types';
import DocFeedback from '@site/src/components/DocFeedback';

type Props = WrapperProps<typeof TOCDesktopType>;

export default function TOCDesktopWrapper(props: Props): React.ReactElement {
  return (
    <>
      <TOCDesktop {...props} />
      <DocFeedback />
    </>
  );
}
