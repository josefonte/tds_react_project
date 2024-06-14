import {Dispatch} from 'redux';
import {
  Edge,
  Media,
  Pin,
  RelatedPin,
  RelatedTrail,
  User,
  Trail,
  Socials,
  Contacts,
  Partners,
  App,
} from './../model/model'; // Adjust the import path as needed
import database from './../model/database'; // Adjust the import path as needed
import axios from 'axios';

export const fetchTrailsRequest = () => {
  console.log('Dispatching fetchTrailsRequest action...');
  return {
    type: 'FETCH_TRAILS_REQUEST',
  };
};

export const fetchTrailsSuccess = () => {
  console.log('Dispatching fetchTrailsSuccess action');
  return {
    type: 'FETCH_TRAILS_SUCCESS',
  };
};

export const fetchTrailsFailure = (error: any) => {
  console.log('Dispatching fetchTrailsFailure action with error:', error);
  return {
    type: 'FETCH_TRAILS_FAILURE',
    payload: error,
  };
};

export const aViajar = () => {
  console.log('Dispatching aViajar action (start)...');
  return {
    type: 'COMECEI_A_VIAJAR',
  };
};

export const acabeiViajar = () => {
  console.log('Dispatching aViajar action (end)...');
  return {
    type: 'ACABEI_DE_VIAJAR',
  };
};

export const addHistorico = (t: Trail) => {
  console.log('Dispatching addHistorico action...');
  return {
    type: 'ADICIONEI_AO_HISTORICO_VIAGEM',
    payload: t,
  };
};

export const fetchTrails = () => {
  console.log('FUI CHAMADO (Colocar Informação na DB)');
  return async (dispatch: Dispatch) => {
    dispatch(fetchTrailsRequest());
    try {
      const response = await fetch(
        'https://1130-193-137-92-26.ngrok-free.app/trails',
      );
      const trailsData = await response.json();

      // Get existing trail IDs from the database
      const existingTrails = await database.collections
        .get<Trail>('trails')
        .query()
        .fetch();
      const existingTrailIds = existingTrails.map(trail => trail.trailId);

      // Insert new trails into the database
      await database.write(async () => {
        // Insert each trail into the appropriate table
        for (const trailData of trailsData) {
          // Use the database instance to create a new Trail record
          if (!existingTrailIds.includes(trailData.id)) {
            const newTrail = await database.collections
              .get<Trail>('trails')
              .create((newTrail: any) => {
                newTrail.trailId = trailData.id;
                newTrail.trailName = trailData.trail_name;
                newTrail.trailDesc = trailData.trail_desc;
                newTrail.trailDuration = trailData.trail_duration;
                newTrail.trailDifficulty = trailData.trail_difficulty;
                newTrail.trailImg = trailData.trail_img;
              });

            for (const relatedTrail of trailData.rel_trail) {
              await database.collections
                .get<RelatedTrail>('related_trails')
                .create((relTrail: any) => {
                  relTrail.value = relatedTrail.value;
                  relTrail.attrib = relatedTrail.attrib;
                  relTrail.trail.set(newTrail);
                });
            }

            for (const edgeData of trailData.edges) {
              const newEdge = await database.collections
                .get<Edge>('edges')
                .create((edge: any) => {
                  edge.edgeId = edgeData.id;
                  edge.edgeTransport = edgeData.edge_transport;
                  edge.edgeDuration = edgeData.edge_duration;
                  edge.edgeDesc = edgeData.edge_desc;
                  edge.trail = edgeData.edge_trail;
                  edge.edgeStartId = edgeData.edge_start.id;
                  edge.edgeEndId = edgeData.edge_end.id;
                });

              for (const pinData of [edgeData.edge_start, edgeData.edge_end]) {
                const newPinn = {
                  pinId: pinData.id,
                  pinName: pinData.pin_name,
                  pinDesc: pinData.pin_desc,
                  pinLat: pinData.pin_lat,
                  pinLng: pinData.pin_lng,
                  pinAlt: pinData.pin_alt,
                  trail: trailData.id,
                };
                const newPin = await database.collections
                  .get<Pin>('pins')
                  .create((pin: any) => {
                    pin.pinId = pinData.id;
                    pin.pinName = pinData.pin_name;
                    pin.pinDesc = pinData.pin_desc;
                    pin.pinLat = pinData.pin_lat;
                    pin.pinLng = pinData.pin_lng;
                    pin.pinAlt = pinData.pin_alt;
                    pin.trail = trailData.id;
                  });

                for (const relPinData of pinData.rel_pin || []) {
                  await database.collections
                    .get<RelatedPin>('related_pins')
                    .create((relPin: any) => {
                      relPin.value = relPinData.value;
                      relPin.attrib = relPinData.attrib;
                      relPin.pin.set(newPin);
                    });
                }

                for (const mediaData of pinData.media || []) {
                  await database.collections
                    .get<Media>('media')
                    .create((media: any) => {
                      media.mediaId = mediaData.id;
                      media.mediaFile = mediaData.media_file;
                      media.mediaType = mediaData.media_type;
                      media.pin = mediaData.media_pin;
                    });
                }
              }
            }
          }
        }
      });

      dispatch(fetchTrailsSuccess());
    } catch (error) {
      dispatch(fetchTrailsFailure(error));
    }
  };
};
// --------- App ---------

export const fetchAppRequest = () => {
  console.log('[FetchApp]: Requesting app...');
  return {
    type: 'FETCH_APP_REQUEST',
  };
};

export const fetchAppSuccess = () => {
  console.log('[FetchApp]: Requests app successfully...');
  return {
    type: 'FETCH_APP_SUCCESS',
  };
};

export const fetchAppFailure = (error: any) => {
  console.log('[FetchApp]: Request app Failed...');
  return {
    type: 'FETCH_APP_FAILURE',
    payload: error,
  };
};

export const fetchApp = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAppRequest());
    try {
      const response = await fetch(
        'https://1130-193-137-92-26.ngrok-free.app/app',
      );
      const appsData = await response.json();

      const existingApp = await database.collections
        .get<App>('app')
        .query()
        .fetch();
      const existingAppNames = existingApp.map(app => app.appName);

      await database.write(async () => {
        for (const appData of appsData) {
          if (!existingAppNames.includes(appData.app_name)) {
            try {
              const newApp = await database.collections
                .get<App>('app')
                .create((app: any) => {
                  app.appName = appData.app_name;
                  app.appDesc = appData.app_desc;
                  app.appLanding = appData.app_landing_page_text;
                });

              if (appData.contacts) {
                for (const contactData of appData.contacts) {
                  try {
                    const newContact = await database.collections
                      .get<Contacts>('contacts')
                      .create((contact: any) => {
                        contact.contactName = contactData.contact_name;
                        contact.contactPhone = contactData.contact_phone;
                        contact.contactUrl = contactData.contact_url;
                        contact.contactMail = contactData.contact_mail;
                        contact.contactDesc = contactData.contact_desc;
                        contact.contactApp = contactData.contact_app;
                      });
                    console.log('New contact created: ', newContact);
                  } catch (createContactError) {
                    console.log(
                      'Error creating new contact',
                      createContactError,
                    );
                  }
                }
              }

              if (appData.partners) {
                for (const partnerData of appData.partners) {
                  try {
                    const newPartner = await database.collections
                      .get<Partners>('partners')
                      .create((partner: any) => {
                        partner.partnerName = partnerData.partner_name;
                        partner.partnerPhone = partnerData.partner_phone;
                        partner.partnerUrl = partnerData.partner_url;
                        partner.partnerMail = partnerData.partner_mail;
                        partner.partnerDesc = partnerData.partner_desc;
                        partner.partnerApp = partnerData.partner_app;
                      });
                    console.log('New partner created: ', newPartner);
                  } catch (createPartnerError) {
                    console.log(
                      'Error creating new partner',
                      createPartnerError,
                    );
                  }
                }
              }

              if (appData.socials) {
                for (const socialData of appData.socials) {
                  try {
                    const newSocial = await database.collections
                      .get<Socials>('socials')
                      .create((social: any) => {
                        social.socialName = socialData.social_name;
                        social.socialUrl = socialData.social_url;
                        social.socialIcon = socialData.social_icon;
                        social.socialApp = socialData.social_app;
                      });
                    console.log('New social created: ', newSocial);
                  } catch (createSocialError) {
                    console.log('Error creating new social', createSocialError);
                  }
                }
              }
            } catch (createError) {
              console.log(
                'Error creating new app or its related entities',
                createError,
              );
            }
          }
        }
      });
      dispatch(fetchAppSuccess());
    } catch (error) {
      dispatch(fetchAppFailure(error));
    }
  };
};

// ----------- USER ------------

export const fetchUser = (cookiesHeader: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(
        'https://1130-193-137-92-26.ngrok-free.app/user',
        {
          headers: {
            Cookie: cookiesHeader,
          },
        },
      );
      const user = await response.data;
      console.log('[FETCH USER] - response : ', user);

      const existingUsers = await database.collections
        .get<User>('users')
        .query()
        .fetch();

      console.log('[FETCH USER] - existing user: ', existingUsers);

      const existingUserIds = existingUsers.map(user => user.username);

      await database.write(async () => {
        if (!existingUserIds.includes(user.username)) {
          try {
            const newUser = await database.collections
              .get<User>('users')
              .create((newUser: User) => {
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.firstName = user.first_name;
                newUser.lastName = user.last_name;
                newUser.userType = user.user_type;
                newUser.lastLogin = user.last_login;
                newUser.isSuperuser = user.is_superuser;
                newUser.isStaff = user.is_staff;
                newUser.isActive = user.is_active;
                newUser.dateJoined = user.date_joined;
                newUser.historico = '';
              });

            console.log('[FETCH USER] - new user : ', newUser);
          } catch (createUserError) {
            console.log('Error creating new user', createUserError);
          }
        }
      });
    } catch (error) {
      console.log('Error fetching user:', error);
    }
  };
};
