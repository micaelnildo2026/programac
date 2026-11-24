import React from 'react';
import type { LabId } from '../../data/curriculum';
import {
  AlgorithmPropertiesLab,
  BinaryConverterLab,
  FlowchartPseudocodeLab,
  LogicGatesLab,
  VariablesMemoryLab,
  VonNeumannLab,
} from './FundamentalsLabs';
import {
  CAnatomyLab,
  OperatorsPrecedenceLab,
  PrintfScanfLab,
  SizeofTypesLab,
} from './IntroCLabs';
import {
  CallStackLab,
  CustomLibsLab,
  FlowControlLab,
  LoopEngineLab,
  ScopeLifetimeLab,
  SelectionBranchLab,
  SequentialTraceLab,
  ValueVsRefLab,
} from './ControlAndModLabs';
import {
  Array1DLab,
  CStringsLab,
  FileIOBenchLab,
  FilePointerCursorLab,
  FileTypesLab,
  FopenModesLab,
  Matrix2DLab,
  MemoryAddressesLab,
  PointerArraysHeapLab,
  PointerSandboxLab,
} from './ArraysPointersFilesLabs';

export function LabRenderer({ labId }: { labId: LabId }) {
  switch (labId) {
    case 'von-neumann':
      return <VonNeumannLab />;
    case 'binary-converter':
      return <BinaryConverterLab />;
    case 'logic-gates':
      return <LogicGatesLab />;
    case 'variables-memory':
      return <VariablesMemoryLab />;
    case 'algorithm-properties':
      return <AlgorithmPropertiesLab />;
    case 'flowchart-pseudocode':
      return <FlowchartPseudocodeLab />;
    case 'c-anatomy':
      return <CAnatomyLab />;
    case 'sizeof-types':
      return <SizeofTypesLab />;
    case 'operators-precedence':
      return <OperatorsPrecedenceLab />;
    case 'printf-scanf':
      return <PrintfScanfLab />;
    case 'sequential-trace':
      return <SequentialTraceLab />;
    case 'selection-branch':
      return <SelectionBranchLab />;
    case 'loop-engine':
      return <LoopEngineLab />;
    case 'flow-control':
      return <FlowControlLab />;
    case 'call-stack':
      return <CallStackLab />;
    case 'value-vs-ref':
      return <ValueVsRefLab />;
    case 'scope-lifetime':
      return <ScopeLifetimeLab />;
    case 'custom-libs':
      return <CustomLibsLab />;
    case 'array-1d':
      return <Array1DLab />;
    case 'matrix-2d':
      return <Matrix2DLab />;
    case 'c-strings':
      return <CStringsLab />;
    case 'memory-addresses':
      return <MemoryAddressesLab />;
    case 'pointer-sandbox':
      return <PointerSandboxLab />;
    case 'pointer-arrays-heap':
      return <PointerArraysHeapLab />;
    case 'file-types':
      return <FileTypesLab />;
    case 'file-pointer-cursor':
      return <FilePointerCursorLab />;
    case 'fopen-modes':
      return <FopenModesLab />;
    case 'file-io-bench':
      return <FileIOBenchLab />;
  }
}
