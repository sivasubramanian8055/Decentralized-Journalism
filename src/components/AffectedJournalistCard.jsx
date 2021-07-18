import { Card, Tag, H5, H3, Spinner, Icon, Tooltip } from '@blueprintjs/core'
import { getCode } from 'country-list'
import React, { Fragment, useEffect, useState } from 'react'
import { CARD_COUNT, diedJournalistUrl, getUniqueJournalistInfo } from '../shared/utils'
import JournalistIllustration from "../static/images/journo.png"

export default function AffectedJournalistCard(props) {
  const [affectedJournalists, setAffectedJournalists] = useState([])
  const fetchAffectedJournalistsData = async () => {
    const response = await fetch(diedJournalistUrl)
    const responseData = await response.json()
    setAffectedJournalists(responseData["data"])
  }

  useEffect(() => {
    fetchAffectedJournalistsData()
  }, [])

  if (!affectedJournalists.length) {
    return <span className="spinner">
      <Spinner intent="primary" />
    </span>
  }
  let affectedJournalistsForDisplay = []
  if (props.showAllJournalists) {
    affectedJournalistsForDisplay = affectedJournalists.filter(
      affectedJournalist => getCode(affectedJournalist.entries[0].country)
    );
  } else {
    affectedJournalists.map((affectedJournalist) => {
      if (affectedJournalistsForDisplay.length < CARD_COUNT) {
        if (getCode(affectedJournalist.entries[0].country)) {
          affectedJournalistsForDisplay.push(affectedJournalist);
        }
      }
    });
  }
  return (
    <Fragment>
      <H3 className="affected__journalists__label mt-10 mb-10 center">
        {props.label}
      </H3>
      <div className="affected__journalists__cards__wrapper">
        {affectedJournalistsForDisplay.map((affectedJournalist) => {
          const { fullName, gender, mtpage, entries } = affectedJournalist;
          const [entry] = entries;
          const { body, location, country, typeOfDeath } = entry;
          console.log(country);
          let countryCode = getCode(country.toLowerCase());
          return (
            <Card
              interactive={true}
              elevation={2}
              key={affectedJournalist.mtpage}
              className="journalist__card"
            >
              <div className="journalist__card__header">
                <div className="journalist__card__header__left">
                  <H5>{fullName}</H5>
                  <span>
                    <a href={mtpage} target="_blank">
                      <Icon icon="paperclip" className="ml_5" />
                    </a>
                  </span>
                  <span>
                    <Tooltip content={`${location}, ${country}`}>
                      <img
                        className="ml_5"
                        width="20"
                        alt={country}
                        src={`https://www.countryflags.io/${countryCode}/shiny/64.png`}
                      />
                    </Tooltip>
                  </span>
                  <Tag className="ml-10" intent="danger" small="true" minimal>
                    <span>{typeOfDeath}</span>
                  </Tag>
                </div>
                <div className="journalist__card__details journalist__card__header__right">
                  <div className="journalist__card__gender">
                    <Tag minimal intent="primary">
                      {gender}
                    </Tag>
                  </div>
                </div>
              </div>
              <div className="journalist__card__body mt-10">
                <div className="journalist__illustration">
                  <img width="120" src={JournalistIllustration} />
                </div>
                <p dangerouslySetInnerHTML={{ __html: body }}></p>
              </div>
            </Card>
          );
        })}
      </div>
      {props.children}
    </Fragment>
  );
}
