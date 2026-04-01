import { type Dialogue } from '../../store';
import { game, say } from '../shared/helpers';

export function buildTourbusAmpDialogue(): Dialogue | string {
  const store = game();
  const { trait, flags } = store;

  if (flags.tourbusAmpTechnician) {
    return say('Du hast den Röhrenverstärker bereits repariert. Er klingt jetzt klar und deutlich.');
  }

  if (trait === 'Technician') {
    return {
      text: 'Ein alter Röhrenverstärker, der nur noch brummt. Als Techniker siehst du sofort das Problem: Eine kalte Lötstelle an der Vorstufe.',
      options: [
        {
          text: 'Repariere ihn schnell.',
          action: () => {
            const currentStore = game();
            if (!currentStore.flags.tourbusAmpTechnician) {
              currentStore.setFlag('tourbusAmpTechnician', true);
              currentStore.increaseBandMood(20);
              currentStore.increaseSkill('technical', 10);
            }
            currentStore.setDialogue('Mit geübten Handgriffen lötest du die Verbindung nach. Der Verstärker klingt jetzt klarer als je zuvor!');
          }
        }
      ]
    };
  } else {
    return say('Ein alter Röhrenverstärker. Er brummt nervtötend, aber du hast keine Ahnung, wie man das repariert.');
  }
}

export function buildTourbusHiddenStashDialogue(): Dialogue | string {
  const store = game();
  const options: import('../../store').DialogueOption[] = [];
  if (!store.flags.tourbusHiddenStashTaken) {
    options.push({
      text: 'Notiz einstecken.',
      action: () => {
        const currentStore = game();
        const pickedUp = currentStore.addToInventory('Geheime Notiz');
        if (pickedUp) {
          currentStore.increaseSkill('social', 2);
          currentStore.setFlag('tourbusHiddenStashTaken', true);
          currentStore.setDialogue('Du steckst die Notiz ein. Matze verbirgt etwas Großes.');
        } else {
          currentStore.setDialogue('Du kannst die Notiz gerade nicht aufnehmen.');
        }
      }
    });
  }
  const frequenzQuest = store.quests.find(q => q.id === 'frequenz_1982');
  if (!store.flags.frequenz1982_tourbus && frequenzQuest?.status === 'active') {
    options.push({
      text: 'Da steckt noch mehr dahinter... [Technical 3]',
      requiredSkill: { name: 'technical', level: 3 },
      action: () => {
        const currentStore = game();
        const pickedUp = currentStore.addToInventory('Frequenzfragment');
        if (pickedUp) {
          currentStore.setFlag('frequenz1982_tourbus', true);
          currentStore.increaseBandMood(10, 'frequenz1982_tourbus_technical');
          currentStore.setDialogue('Du analysierst das Versteck genauer und findest hinter der Notiz ein Frequenzfragment, das in der Wandverkleidung verborgen war.');
        } else {
          currentStore.setDialogue('Du spürst das Frequenzfragment, aber dein Inventar hat keinen Platz mehr.');
        }
      }
    });
  }

  options.push({
    text: 'Die Notiz ignorieren.',
    action: () => game().setDialogue('Du entscheidest dich, dass manche Geheimnisse besser unberührt bleiben.')
  });

  return {
    text: 'Ein kleines Geheimfach in der Wandverkleidung. Du findest eine Notiz in Matzes Handschrift: "Sie dürfen nicht nach Salzgitter. Die Frequenz wird ihn aufwecken."',
    options
  };
}

export function buildTourbusGhostDialogue(): Dialogue | string {
  const store = game();
  const { flags, hasItem } = store;
  const hasGeisterDrink = hasItem('Geister-Drink');

  if (hasGeisterDrink && !flags.ghostRecipeQuestCompleted) {
    return {
      text: 'Geist: "Ist das... der Geister-Drink? Mein altes Rezept! Ich spüre, wie meine Seele wieder... fest wird. Danke, Manager."',
      options: [
        {
          text: 'Prost!',
          action: () => {
            const currentStore = game();
            const received = currentStore.addToInventory('Verstärker-Schaltplan');
            if (received) {
              currentStore.removeFromInventory('Geister-Drink');
              currentStore.completeQuestWithFlag('ghost_recipe', 'ghostRecipeQuestCompleted', true, 'Mixe den Geister-Drink für den Geist des Roadies');
              currentStore.increaseBandMood(40);
              currentStore.increaseSkill('social', 5);
              currentStore.setDialogue('Geist: "Du hast mir mehr gegeben als nur ein Getränk. Du hast mir ein Stück meiner Vergangenheit zurückgegeben. Hier, nimm diesen alten Verstärker-Schaltplan. Er könnte in Salzgitter nützlich sein."');
            } else {
              currentStore.setDialogue('Geist: "Ich habe ein Geschenk für dich, aber dein Inventar ist voll. Mach Platz für den Schaltplan!"');
            }
          }
        }
      ]
    };
  }

  if (flags.ghostSecretRevealed && !flags.ghostTrustEarned) {
    return {
      text: 'Geist: "Du kennst jetzt mein Geheimnis. Warum bist du noch hier?"',
      options: [
        {
          text: 'Ich will dir wirklich helfen. [Mystic]',
          requiredTrait: 'Mystic',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "Du fühlst meine Unruhe... Du bist nicht wie die anderen Manager. Ich vertraue dir."');
            currentStore.completeQuestWithFlag('ghost_trust', 'ghostTrustEarned', true, 'Gewinne das Vertrauen des Geist-Roadies');
            currentStore.increaseBandMood(25);
            currentStore.discoverLore('ghost_legacy');
          }
        },
        {
          text: 'Erzähl mir deine Geschichte. [Social 7]',
          requiredSkill: { name: 'social', level: 7 },
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "Meine Geschichte... sie ist ein Echo. Aber du hörst zu. Das ist selten. Ich vertraue dir."');
            currentStore.completeQuestWithFlag('ghost_trust', 'ghostTrustEarned', true, 'Gewinne das Vertrauen des Geist-Roadies');
            currentStore.increaseBandMood(20);
            currentStore.discoverLore('ghost_legacy');
          }
        },
        {
          text: 'Nur aus Neugier.',
          action: () => game().setDialogue('Geist: "Neugier tötet die Katze. Oder den Roadie."')
        }
      ]
    };
  }

  if (flags.ghostRecipeQuestStarted && !hasGeisterDrink) {
    return say('Geist: "Hast du den Geister-Drink schon gemixt? Turbo-Koffein und ein rostiges Plektrum... das ist die einzige Lösung."');
  }

  if (flags.ghostSecretRevealed) {
    return say('Geist: "Du weißt jetzt, was zu tun ist. Der Stahl vergisst nie."');
  }

  if (flags.bassist_clue_matze && !flags.bassist_clue_ghost) {
    return {
      text: 'Geist: "Matze hat geredet? Er sollte besser schweigen über die Dinge, die er nicht versteht."',
      options: [
        {
          text: 'Matze hat mir vom Bassisten erzählt. Warst du dabei?',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "Dabei? Ich war derjenige, der sein Kabel eingesteckt hat. Das letzte Kabel, das er je brauchte. Die Frequenz... sie hat ihn einfach verschluckt."');
            currentStore.setFlag('bassist_clue_ghost', true);
            currentStore.increaseBandMood(15);
            currentStore.increaseSkill('social', 3);
          }
        },
        {
          text: 'Ich spüre seine Präsenz in deinem Echo. [Mystic]',
          requiredTrait: 'Mystic',
          action: () => {
            const currentStore = game();
            const received = currentStore.addToInventory('Bassist-Saite');
            if (received) {
              currentStore.setFlag('bassist_clue_ghost', true);
              currentStore.increaseBandMood(20);
              currentStore.setDialogue('Geist: "Du hast die Gabe... hier, nimm dies. Es ist alles, was von ihm übrig blieb, nachdem das Feedback abebbte. Die Bassist-Saite."');
            } else {
              currentStore.setDialogue('Geist: "Ich möchte dir etwas geben, aber du kannst gerade nichts mehr tragen. Komm wieder, wenn du Platz hast."');
            }
          }
        },
        {
          text: 'Erzähl mir nichts.',
          action: () => game().setDialogue('Geist: "Der Lärm ist lauter als die Wahrheit."')
        }
      ]
    };
  }

  if (flags.askedAbout1982 && !flags.ghostSecretRevealed) {
    return {
      text: 'Geist: "Du hast Matze nach 1982 gefragt... du bist neugierig. Das ist gefährlich. Willst du wirklich wissen, was mit dem Bassisten geschah?"',
      options: [
        {
          text: 'Erzähl mir alles. [Visionary]',
          requiredTrait: 'Visionary',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "Du siehst die Muster, nicht wahr? Er ist nicht einfach verschwunden. Er wurde Teil der Frequenz. Er ist jetzt der Lärm, den ihr in Salzgitter spielen werdet. Er wartet auf euch."');
            currentStore.setFlag('ghostSecretRevealed', true);
            currentStore.increaseBandMood(30);
            currentStore.increaseSkill('chaos', 5);
          }
        },
        {
          text: 'Analysiere die Anomalie. [Technical 7]',
          requiredSkill: { name: 'technical', level: 7 },
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "Die Frequenzverschiebung war massiv. 1982 gab es einen Riss im Raum-Zeit-Gefüge der Gießerei. Er wurde in die Oberschwingungen gesaugt. Faszinierend, oder?"');
            currentStore.setFlag('ghostSecretRevealed', true);
            currentStore.increaseBandMood(25);
            currentStore.increaseSkill('technical', 4);
          }
        },
        {
          text: 'Beruhige den Geist. [Social 5]',
          requiredSkill: { name: 'social', level: 5 },
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "Deine Stimme ist... beruhigend. Fast wie ein sanfter Chorus-Effekt. Na gut, ich erzähle es dir. Er ist jetzt Teil des Feedbacks. Er wartet in Salzgitter."');
            currentStore.setFlag('ghostSecretRevealed', true);
            currentStore.discoverLore('roadie_bassist');
            currentStore.increaseBandMood(20);
            currentStore.increaseSkill('social', 3);
          }
        },
        {
          text: 'Erzähl mir alles.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "Er ist nicht einfach verschwunden. Er wurde Teil der Frequenz. Er ist jetzt der Lärm, den ihr in Salzgitter spielen werdet. Er wartet auf euch."');
            currentStore.setFlag('ghostSecretRevealed', true);
            currentStore.increaseBandMood(20);
          }
        },
        {
          text: 'Vielleicht später.',
          action: () => game().setDialogue('Geist: "Die Wahrheit wartet nicht. Aber der Lärm schon."')
        }
      ]
    };
  }

  if (hasItem('Industrie-Talisman') && !flags.ghostSecretRevealed) {
    return {
      text: 'Geist: "Dieser Talisman... er gehörte unserem alten Manager. Er ist bei dem Gig in der Gießerei 1982 spurlos verschwunden. Willst du wissen, was wirklich geschah?"',
      options: [
        { text: 'Erzähl mir die Wahrheit.', action: () => {
          const currentStore = game();
          currentStore.setDialogue('Geist: "Der Sound war so perfekt, dass er ein Tor öffnete. Er ist nicht verschwunden... er ist Teil des Feedbacks geworden. Er IST jetzt der Lärm. Wenn ihr in Salzgitter spielt, werdet ihr ihn hören."');
          currentStore.setFlag('ghostSecretRevealed', true);
          currentStore.increaseBandMood(20);
        }},
        { text: 'Manche Geheimnisse sollten begraben bleiben.', action: () => {
          const currentStore = game();
          currentStore.setDialogue('Geist: "Vielleicht hast du recht. Aber der Lärm findet immer einen Weg."');
          currentStore.increaseBandMood(5);
        }}
      ]
    };
  }

  if (hasItem('Verbotenes Riff')) {
    return {
      text: 'Geist: "Du trägst das Verbotene Riff... Ich kann die Schreie der 80er hören. Es ist eine schwere Last. Bist du bereit, den Preis zu zahlen?"',
      options: [
        { text: 'Für den Metal tue ich alles.', action: () => {
          const currentStore = game();
          currentStore.setDialogue('Geist: "Ein mutiger Narr. Das Riff wird dich verändern. Aber der Gig wird unvergesslich."');
          currentStore.increaseBandMood(10);
        }},
        { text: 'Was für ein Preis?', action: () => {
          const currentStore = game();
          currentStore.setDialogue('Geist: "Deine Ohren werden bluten, dein Herz wird im Takt der Maschinen schlagen. Ein fairer Tausch."');
        }}
      ]
    };
  } else {
    return {
      text: 'Geist: "Ich hab die 80er überlebt, aber diese Tour... die wird euch vernichten. Was willst du wissen, Sterblicher?"',
      options: [
        { text: 'Wie überlebe ich?', action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "Hör niemals auf zu spielen. Wenn die Stille kommt, kommen sie. Die Schatten des Feedbacks."');
            currentStore.increaseBandMood(5);
        }},
        { text: 'Wo ist das beste Bier?', action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "In der Vergangenheit. Aber das im Kühlschrank tut es auch. Es schmeckt nach Reue."');
            currentStore.increaseBandMood(5);
        }},
        { text: 'Wer bist du eigentlich?', action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "Ich war derjenige, der die Kabel rollte, als die Welt noch aus Röhrenverstärkern bestand. Jetzt bin ich nur noch eine statische Entladung."');
            currentStore.increaseBandMood(5);
        }},
        { text: 'Kann ich dir irgendwie helfen?', action: () => {
            const currentStore = game();
            currentStore.setDialogue('Geist: "Ich sehne mich nach dem Geister-Drink. Er erinnert mich an die guten alten Zeiten. Wenn du ihn mir bringst, werde ich dir helfen."');
            currentStore.startQuestWithFlag('ghost_recipe', 'Mixe den Geister-Drink für den Geist des Roadies', 'ghostRecipeQuestStarted');
            currentStore.increaseBandMood(5);
        }}
      ]
    };
  }
}

export function buildTourbusBandMeetingDialogue(): Dialogue | string {
  if (game().flags.tourbusBandMeeting) {
    return say('Die Bandbesprechung hat bereits stattgefunden.');
  }
  return {
    text: 'Manager: "Zeit für eine kurze Band-Besprechung in der Mitte des Busses."',
    options: [
      {
        text: 'Vermittle zwischen den Spannungen. [Diplomat]',
        requiredTrait: 'Diplomat',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Manager: "Wir sind hier, weil wir den Lärm lieben. Egal was kommt, wir halten zusammen." Matze nickt zustimmend.');
          currentStore.completeQuestWithFlag('band_meeting', 'tourbusBandMeeting', true, 'Halte eine Band-Besprechung im Tourbus ab');
          currentStore.increaseBandMood(30);
        }
      },
      {
        text: 'Reißt euch zusammen! [Brutalist]',
        requiredTrait: 'Brutalist',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Manager: "Schluss mit dem Gejammer! Wir sind NEUROTOXIC. Wir spielen, bis die Wände bluten!"');
          currentStore.completeQuestWithFlag('band_meeting', 'tourbusBandMeeting', true, 'Halte eine Band-Besprechung im Tourbus ab');
          currentStore.increaseBandMood(20);
        }
      },
      {
        text: 'Motivationsrede halten. [Performer]',
        requiredTrait: 'Performer',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Manager: "Stellt euch das Scheinwerferlicht vor. Die schreiende Menge. Heute Nacht schreiben wir Geschichte!" Marius jubelt.');
          currentStore.completeQuestWithFlag('band_meeting', 'tourbusBandMeeting', true, 'Halte eine Band-Besprechung im Tourbus ab');
          currentStore.increaseBandMood(25);
        }
      },
      {
        text: 'Einfache Ansagen machen.',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Manager: "Ausrüstung checken, pünktlich sein, keinen Mist bauen. Klar?"');
          currentStore.completeQuestWithFlag('band_meeting', 'tourbusBandMeeting', true, 'Halte eine Band-Besprechung im Tourbus ab');
          currentStore.increaseBandMood(10);
        }
      }
    ]
  };
}