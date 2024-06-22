export interface Task {
    id: string;
    content: string;
  }
  
  export interface Column {
    name: string;
    items: Task[];
  }
  
  export interface Columns {
    [key: string]: Column;
  }