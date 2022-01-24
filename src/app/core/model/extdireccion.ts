import { Point } from './geometry/point';

export interface Extdireccion {
  claseViaPrincipalId: number;
  codigoPostal: string;
  complemento: string;
  correoElectronico: string;
  esDireccionPrincipal: boolean;
  id: number;
  letraViaGeneradora: string;
  letraViaPrincipal: string;
  localizacion: Point;
  nombrePredio: string;
  sectorCiudadId: number;
  sectorPredioId: number;
  telefono1: string;
  telefono2: string;
  tipoDireccionId: number;
  valorViaGeneradora: string;
  valorViaPrincipal: string;
}
