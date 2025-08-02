export enum SHIPMENTSTATUS {
  READYTODISPATCH = 'READYTODISPATCH',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED'
}

export interface DispatchSummary {
  id: number;
  shipmentStatus: SHIPMENTSTATUS;
  courierService: string;
  shipmentCode: string;
  shipmentId: string;
  orderId: number;
}
