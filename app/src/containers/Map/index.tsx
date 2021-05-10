import { Route, Switch } from "react-router";

import CreatorMap from "./CreatorMap";
import FindMap from "./FindMap";

export type EggBox = {
  lat: number | null;
  lng: number | null;
  locked: boolean | null;
  id: number | null;
};

export default function Index({ match }: any) {
  return (
    <>
      <Switch>
        <Route path={match.url + "/creator"} component={CreatorMap} />
        <Route path={match.url + "/egg/:egg"} component={FindMap} />
      </Switch>
    </>
  );
}
