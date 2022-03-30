import { Attrib } from './types';
declare const createAttrib: (name: string, value: string) => Attrib;
export default createAttrib;
export declare const isAttrib: (attrib: any) => attrib is Attrib;
