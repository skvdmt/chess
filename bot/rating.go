package chess_bot

import (
	"github.com/skvdmt/chess/game"
	"math/rand"
)

// NewRating returns a link to a new rating
func newRating() *rating {
	r := &rating{}
	return r
}

// rating data type containing methods for calculating the rating of the team's possible moves
type rating struct {
	teamPossibleMoves  *game.TeamPossibleMoves
	teamBrokenFields   *game.TeamBrokenFields
	enemyPossibleMoves *game.TeamPossibleMoves
	enemyBrokenFields  *game.TeamBrokenFields
	bot                *Bot
}

func (r *rating) setBot(b *Bot) {
	r.bot = b
}

// setTeamPossibleMoves setting the value of the possible moves of the command from the argument
func (r *rating) setTeamPossibleMoves(tpms *game.TeamPossibleMoves) {
	r.teamPossibleMoves = tpms
}

// setTeamBrokenFields setting the value of broken command fields from the argument
func (r *rating) setTeamBrokenFields(tbfs *game.TeamBrokenFields) {
	r.teamBrokenFields = tbfs
}

// setEnemyPossibleMoves setting the value of the possible moves of the enemy team from the argument
func (r *rating) setEnemyPossibleMoves(epms *game.TeamPossibleMoves) {
	r.enemyPossibleMoves = epms
}

// setEnemyBrokenFields setting the value of the broken fields of the enemy team from the argument
func (r *rating) setEnemyBrokenFields(ebfs *game.TeamBrokenFields) {
	r.teamBrokenFields = ebfs
}

// setRandomRatingToPossibleMoves sets a random rating from 0 to 10 for all possible moves
func (r *rating) setRandomRatingToPossibleMoves() {
	for _, mvs := range *r.teamPossibleMoves {
		for _, mv := range *mvs {
			mv.SetRating(rand.Float64() * 10)
		}
	}
	r.bot.team.ShowPossibleMoves(r.teamPossibleMoves)
}

// GetMoveWithMaxRating get a link to the new action with the highest rating
func (r *rating) getMoveWithMaxRating() *move {
	var rat float64
	var m *game.Move
	var fi game.FigurerIndex
	for index, mvs := range *r.teamPossibleMoves {
		for _, mv := range *mvs {
			if mv.GetRating() > rat {
				rat = mv.GetRating()
				m = mv
				fi = index
			}
		}
	}
	return newMove(r.bot, r.bot.team.Figures[fi].GetPosition(), game.NewPosition(m.X, m.Y))
}