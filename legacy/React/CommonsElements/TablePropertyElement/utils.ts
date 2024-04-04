export const arrayMove: <T>(arr: T[], fromIndex: number, toIndex: number) => T[] = (
  arr,
  fromIndex,
  toIndex
) => {
  const newArr = [...arr];
  const [removed] = newArr.splice(fromIndex, 1);
  newArr.splice(toIndex, 0, removed);
  return newArr;
};
