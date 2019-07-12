import { Maze } from './maze';

test('Maze is generated', () => {
  const maze = new Maze(16, 543210);
  expect(maze.diagram()).toBe(
``);
});
