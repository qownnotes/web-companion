#!/bin/bash
# Use this script in $ProjectFileDir$ to download the translations from Crowdin

TRANSLATION_PATH="app/_locales"

echo "Downloading translation from Crowdin..."
java -jar /opt/crowdin-cli/crowdin-cli.jar download translations
echo

// no renaming needed

## we have to do this because this currently doesn't work in crowdin-cli
#echo "Renaming translation folders..."
#cd ${TRANSLATION_PATH}
#
#mv ar_SA ar
#mv ca_ES ca
#mv cs_CZ cs
#mv de_DE de
#mv es_ES es
#mv fr_FR fr
#mv hr_HR hr
#mv hu_HU hu
#mv it_IT it
#mv ja_JP ja
#mv nl_NL nl
#mv pl_PL pl
#mv ru_RU ru
#mv uk_UA uk
#mv sv_SE sv
#mv id_ID id
#mv bn_BD bn
#mv tr_TR tr
#mv tl_PH tl
#mv fil_PH fil
#mv ceb_PH ceb
#mv hil_PH hil
#mv hi_IN hi
#mv ur_PK ur
#mv fi_FI fi
#mv el_GR el
