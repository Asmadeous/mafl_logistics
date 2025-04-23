declare module "react-quill" {
    import { ComponentType, Ref } from "react";
  
    export interface ReactQuillProps {
      theme?: string;
      value?: string;
      onChange?: (value: string) => void;
      modules?: Record<string, any>;
      formats?: string[];
      placeholder?: string;
      className?: string;
      ref?: Ref<ReactQuill>;
    }
  
    export interface ReactQuill {
      // Minimal type for ref usage
      getEditor: () => any;
    }
  
    const ReactQuill: ComponentType<ReactQuillProps>;
    export default ReactQuill;
  }