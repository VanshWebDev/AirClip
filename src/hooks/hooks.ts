import { useDispatch, useSelector, type TypedUseSelectorHook} from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

/**
 * File Name: hooks.ts
 * Purpose: A central place for typed versions of the standard Redux hooks.
 * Using these instead of the plain `useDispatch` and `useSelector` will give you
 * full type inference and safety in your components. This is a best practice.
 */

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
