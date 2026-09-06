import { deliveryAndRetrievalConcepts } from './system-design-core/deliveryAndRetrieval';
import { distributedDataConcepts } from './system-design-core/distributedData';
import { foundationsAndScaleConcepts } from './system-design-core/foundationsAndScale';
import { messagingAndRealtimeConcepts } from './system-design-core/messagingAndRealtime';
import { reliabilityAndOperationsConcepts } from './system-design-core/reliabilityAndOperations';

export const coreSystemDesignConcepts = [
  ...foundationsAndScaleConcepts,
  ...distributedDataConcepts,
  ...messagingAndRealtimeConcepts,
  ...deliveryAndRetrievalConcepts,
  ...reliabilityAndOperationsConcepts,
].sort((left, right) => Number(left.id.slice(1)) - Number(right.id.slice(1)));
