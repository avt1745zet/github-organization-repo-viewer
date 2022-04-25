# github-organization-repo-viewer

## How to run:
use npm start. 
## 架構設計理念：
1.   API call function 都放在 useEffect 內，因為 useEffect 可以指定 dependencies，當指定的 dependencies change 才會進入到考慮要不要 call API 的環節，避免非必要的 calling。
2.   能夠不 re-render 就不 re-render，使用 React.memo 判斷前後兩次的 data change 是否需要 render. 
3.   擁抱 SRP, 每個 component 必須只處理他份內的事。
4.   使用 IntersectionObserver 觀察 repository list 的最後一個 repository div，當觀察到時，判斷是否能 fetch 下一頁的資料，如果能就 fetch 反之則否。

基於上述想法，我將 Organization component 作為頂層元件，data fetching 將在這處理，作為父元件，取得子元件資料更新的部分，盡可能使用 callback 減少耦合度，其餘元件的做法也差不多雷同；然後子元件的行為以父元件傳遞的資料去做驅動。 