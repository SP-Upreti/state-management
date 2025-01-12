import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/store"
import { decrement, increment, incrementAsync, incrementByAmount } from "../store/counter/counterSlice"

export default function Counter() {
    const count = useSelector((state: RootState) => state.counter.value)
    const dispatch = useDispatch<AppDispatch>()
    return (
        <div>
            <h2>{count}</h2>
            <div className="">
                <button onClick={() => dispatch(increment())}>increment</button>
                <button onClick={() => { dispatch(decrement()) }}>decrement</button>
                <button onClick={() => { dispatch(incrementByAmount(20)) }}>IncrementAmount</button>
                <button onClick={() => { dispatch(incrementAsync(20)) }}>async</button>
            </div>
        </div>
    )
}
