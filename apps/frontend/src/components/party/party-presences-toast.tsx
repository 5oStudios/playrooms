import { useAppDispatch, useAppSelector } from '../../hooks/use-redux-typed';

export default function PartyPresencesToast() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);

  return null;
}
