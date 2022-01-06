import React from 'react';

const Awards = (props) => {

    const { article } = props;

    if (article.data.all_awardings.length > 0) {
        return (
            <div className="tileAwards">
                {
                    article.data.all_awardings.map(award => {
                        return (
                            <div className="tileAward" key={award.id}>
                                <img src={award.icon_url} alt={award.name}/>
                                <p>
                                    {award.count > 1 ? award.count : undefined}
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Awards;