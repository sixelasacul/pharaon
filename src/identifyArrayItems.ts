import { v4 as uuidv4 } from 'uuid';

export function identifyArrayItems<T extends string | number | boolean>(
  array: T[]
): Array<{ id: string; content: T }> {
  return array.map((item) => ({
    id: uuidv4(),
    content: item,
  }));
}
