import CMS from "netlify-cms-app"

import { SudokuPreview, SudokuControl } from "./components/Sudoku"

CMS.registerWidget("sudoku", SudokuControl, SudokuPreview)
