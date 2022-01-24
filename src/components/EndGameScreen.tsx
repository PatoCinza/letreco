import { useContext, useMemo, useState } from 'react';
import { EndGameScreenProps } from '../models';
import Button from './Button';
import Overlay from './Overlay';
import '../styles/EndGameScreen.css';
import { getNormalEndGameMessage } from '../utils';
import { GlobalSettingsContext } from '../hooks/useGlobalSettings';
import { StatisticsView } from './StatisticsView';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SAVED_GAME_INIT, SAVED_GAME_KEY } from './Game'
import { setTimeout } from 'timers';

function EndGameScreen(props: EndGameScreenProps) {
  const [{isColorblindModeActive}] = useContext(GlobalSettingsContext);

    const [{
      date: savedDate, guesses, winState, letterStates,
    }, setSavedGame] = useLocalStorage(SAVED_GAME_KEY, SAVED_GAME_INIT);

  const [isResultCopied, setIsResultCopied] = useState<boolean>(false);
  const message = useMemo<string>(
    () => getNormalEndGameMessage('000', props.guesses, props.isGameWon),
    [props.guesses, props.isGameWon],
  );

  const canShare = (): boolean => {
    return navigator.canShare && navigator.canShare({ text: '' });
  }

  const handleCopyButton = () => {
    navigator.clipboard.writeText(message);
    setIsResultCopied(true);
    setSavedGame({
      date: new Date().getTime(),
      guesses: [[]],
      winState: { isGameEnded: false, isGameWon: false },
      letterStates: {},
    })
    window.location.reload()
  }

  const handleShareButton = () => {
    navigator.share({ text: message });
  }

  const shareButton = canShare()
    ? (
      <Button
        className='mb-2'
        onClick={() => handleShareButton()}
        label='COMPARTILHAR'
      />
    )
    : '';

  return (
    <Overlay content={
      <div className='content row'>
        <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>
          <div>
            <h1
              className={
                'text-center mb-3 '
                + (isColorblindModeActive ? 'colorblind ': '')
                + (props.isGameWon ? 'win-text' : 'lose-text')
              }
            >Você {props.isGameWon ? 'acertou!' : 'não conseguiu...'}</h1>
            <p className='text-center mb-1'>o Letreco do dia era: <b>{props.dailyWord}</b></p>
            <p className='text-center mb-3'>você usou <b>{props.guesses.length} de 6</b> tentativas</p>

            <div className="d-flex flex-column justify-content-center align-items-center">
              {shareButton}

              <Button
                className='mb-2'
                onClick={() => handleCopyButton()}
                label={isResultCopied ? 'COPIADO' : 'COPIAR RESULTADO'}
              />

              <Button
                onClick={() => props.handleCloseScreen()}
                label='FECHAR'
              />
            </div>
          </div>
        </div>

        <div className='col-12 col-md-6 mt-4 mt-md-0'>
          <StatisticsView />
        </div>
      </div>
    }/>
  );
}

export default EndGameScreen;