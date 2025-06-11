'use client';
import dynamic from 'next/dynamic';
const CreatableSelectInput = dynamic(() => import('@/components/CustomCreatableSelectInner'), {
  ssr: false,
});

export default CreatableSelectInput;