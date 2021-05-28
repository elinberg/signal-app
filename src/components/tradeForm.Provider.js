import TradeFormContext from "./tradeFormContext"

const TradeFormProvider = props => {
    const state = {
        onTabSelect: {},
        prev: '',
        setTab:{},
        tab: '',
        selectedTicker:'',
        exchange: [],
      } ;

      return (
        <TradeFormContext.Provider
        value={{state: state}}
        >
            {/* {props.children} */}
        </TradeFormContext.Provider>
      )
}
export default TradeFormProvider