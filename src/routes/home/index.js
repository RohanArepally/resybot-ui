import { h } from 'preact';
import style from './style.css';
import {useState, useEffect} from "preact/hooks";

const Home = () => {
	const [restaurants, setRestaurants] = useState([]);
	const [shouldFilterNew, setShouldFilterNew] = useState(false);
	const [shouldFilterReleaseTime, setShouldFilterReleaseTime] = useState(false);
	const [searchText, setSearchText] = useState("")

	useEffect(() => {
		fetch('/api/restaurants').then(response => response.json()).then(data => setRestaurants(data.restaurants));
	}, [])

	let filteredRestaurants = restaurants.filter((r) => r.name.toLowerCase().includes(searchText.toLowerCase()));



	if (shouldFilterReleaseTime) {
		filteredRestaurants = filteredRestaurants.filter(r => r.hasOwnProperty('release_time_at'))
	}
	if (shouldFilterNew) {
		filteredRestaurants = filteredRestaurants.filter(r => (Math.floor(Date.now() / 1000) - r.created_at) <= 1210000).sort((a,b) => b.created_at - a.created_at);
	}

	filteredRestaurants = (searchText === "" && (!shouldFilterNew && !shouldFilterReleaseTime)) ? [] : filteredRestaurants;
	return (
		<div class={style.home}>
			<input class={style.search} onKeyUp={e => setSearchText(e.target.value)} placeholder="search restaurant name..." />
			<div class={style.buttons}>
				<button class={shouldFilterReleaseTime ? style.buttonActive : style.button} onClick={() => {setShouldFilterReleaseTime(!shouldFilterReleaseTime)}}>With Release Time</button>
				<button class={shouldFilterNew ? style.buttonActive : style.button} onClick={(e) => {setShouldFilterNew(!shouldFilterNew)}}>New</button>
				<button class={style.button} onClick={() => {}}>Favorites ❤️</button>
			</div>
			{
				filteredRestaurants.map((r) => (
					<div class={style.box} key={r.object_id}>
						<div class={style.name}><strong>{r.name}</strong></div>
						<div><span class={style.label}>Dinner Today: </span><span class={style.labelValue}>{r.same_day_dinner_probability}</span></div>
						<div><span class={style.label}>Dinner Next Week: </span><span class={style.labelValue}>{r.next_week_dinner_probability}</span></div>
						<div><span class={style.label}>Joined Resy: </span><span class={style.labelValue}>{r.created_at_human}</span></div>
						{r.hasOwnProperty('release_time_at') &&
								<div><span class={style.label}>Release Time At: </span><span class={style.labelValue}>{r.release_time_at}</span></div>
						}
						{r.hasOwnProperty('num_days') && <div><span class={style.label}>Days Out: </span><span class={style.labelValue}>{r.num_days}</span></div>}
					</div>
				))
			}
		</div>
	);
};

export default Home;
