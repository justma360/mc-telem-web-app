import React, { memo } from 'react';

export const SampleComponent = memo(() => <div>hello world</div>);

SampleComponent.displayName = 'SampleComponent';

export default SampleComponent;
