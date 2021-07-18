export const chartDataUrl = "https://datamanager.cpj.org/api/datamanager/reports/entries?group(year)&includes=Year,%27Motive%20Confirmed%27,%27Motive%20Unconfirmed%27,%27Media%20Worker%27&as(year,%20Year)&as(sum(if(eq(type,%27Media%20Worker%27),1,0)),%27Media%20Worker%27)&as(sum(if(and(eq(motiveConfirmed,Confirmed),eq(type,Journalist)),1,0)),%27Motive%20Confirmed%27)&as(sum(if(eq(motiveConfirmed,Unconfirmed),1,0)),%27Motive%20Unconfirmed%27)&or(eq(type,%20%27Media%20Worker%27),%20ne(motiveConfirmed,%20null))&order=-year&in(status,%27Killed%27)&or(eq(type,%22media%20worker%22),in(motiveConfirmed,%27Confirmed%27))&in(type,%27Journalist%27)&ge(year,1992)&le(year,2021)"

export const diedJournalistUrl = "https://api.cpj.org/v1/persons/"

export const CARD_COUNT = 6

export const getChartData = (data) => {
  const colors = ['rgba(13, 204, 99, 0.2)']
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: 'No of crimes',
      data: data.data,
      backgroundColor: colors,
      borderColor: getColours().slice(0,data.labels.length),
      borderWidth: 2
    }]
  }
  return chartData
}

export const getColours = () => {
  let colors = []
  while (colors.length < 50) {
    do {
      var color = Math.floor((Math.random() * 1000000) + 1);
    } while (colors.indexOf(color) >= 0);
    colors.push("#" + ("000000" + color.toString(16)).slice(-6));
  }
  return colors
}

export const getUniqueJournalistInfo = (data, key) => {
  return [
    ...new Map(
      data.map(x=> [key[x],x])
    ).values()
  ]
}